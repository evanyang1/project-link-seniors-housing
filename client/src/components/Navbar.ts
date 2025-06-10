import React from 'react';

interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  brandName: string;
  links: NavLink[];
}

const Navbar: React.FC<NavbarProps> = ({ brandName, links }) => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f0f0f0',
      borderBottom: '1px solid #ddd'
    }}>
      <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>{brandName}</a>
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', margin: 0, padding: 0 }}>
        {links.map((link, index) => (
          <li key={index} style={{ marginLeft: '1rem' }}>
            <a href={link.href} style={{ textDecoration: 'none', color: '#333' }}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;