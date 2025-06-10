import { Request, Response } from "express";
import { Message, IMessage } from "../models/Message";
import { User } from "../models/User";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, listingId, content } = req.body;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      listing: listingId,
      content,
    });

    await message.save();

    // Populate sender and receiver details
    await message.populate([
      { path: "sender", select: "firstName lastName profilePicture" },
      { path: "receiver", select: "firstName lastName profilePicture" },
      { path: "listing", select: "title" },
    ]);

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Get all unique conversations (users who have exchanged messages)
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { receiver: req.user._id }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", req.user._id] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          user: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            profilePicture: 1,
          },
          lastMessage: {
            _id: 1,
            content: 1,
            createdAt: 1,
            read: 1,
            listing: 1,
          },
        },
      },
      {
        $skip: (Number(page) - 1) * Number(limit),
      },
      {
        $limit: Number(limit),
      },
    ]);

    const total = await Message.distinct("sender", {
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    }).length;

    res.json({
      conversations,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalConversations: total,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify that the user is part of the conversation
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate([
        { path: "sender", select: "firstName lastName profilePicture" },
        { path: "receiver", select: "firstName lastName profilePicture" },
        { path: "listing", select: "title" },
      ]);

    // Mark unread messages as read
    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        read: false,
      },
      { read: true }
    );

    const total = await Message.countDocuments({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    });

    res.json({
      messages: messages.reverse(), // Return in chronological order
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalMessages: total,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false,
    });

    res.json({ unreadCount: count });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to fetch unread count",
      error: error.message,
    });
  }
};
