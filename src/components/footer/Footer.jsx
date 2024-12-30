import React from 'react';
import './Footer.css'; 

const Footer = ({ userType }) => {
 
  const UserLinks = [
    { name: 'Hem',  path: '/' },
    { name: 'Kalender',  path: '/kalender' },
    { name: 'Profil',  path: '/profil' },
  ];

  const doctorLinks = [
    { name: 'Patienter',  path: '/patienter' },
    { name: 'Journaler', path: '/journaler' },
  ];

  const patientLinks = [
    { name: 'Bokningar', path: '/bokningar' },
    { name: 'Recept', path: '/recept' },
  ];

  const links = [
    ...UserLinks,
    ...(userType === 'doctor' ? doctorLinks : []),
    ...(userType === 'patient' ? patientLinks : []),
  ];

  return (
    <footer className="footer">
      <nav className="footer-nav">
        {links.map((link) => (
          <a key={link.name} href={link.path} className="footer-link">
            <span className="label">{link.name}</span>
          </a>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;

/// <Footer userType="doctor" /> This for the doctor
/// <Footer userType="patient" /> for the patient