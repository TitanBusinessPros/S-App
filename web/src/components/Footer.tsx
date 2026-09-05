import { Link } from 'react-router-dom'
import './Footer.css'

/** Shared across the authenticated app shell and standalone public pages
 * (Terms, etc.) so the company info only has to change in one place. */
export function Footer() {
  return (
    <footer className="app-footer">
      <p>Created by Titan Business Pros LLC</p>
      <p>
        <a href="tel:+14059987979">405-998-7979</a>
        <span aria-hidden="true"> · </span>
        <a href="https://www.oklahoma.marketing" target="_blank" rel="noreferrer">
          www.oklahoma.marketing
        </a>
      </p>
      <p>Oklahoma City, OK</p>
      <p>
        <Link to="/terms">Terms of Service</Link>
      </p>
      <p>© 2026 Titan Business Pros LLC. All rights reserved.</p>
    </footer>
  )
}
