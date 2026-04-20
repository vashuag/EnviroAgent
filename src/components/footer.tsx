"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react"
import { NewsletterSignup } from "./newsletter-signup"

export function Footer() {
  return (
    <footer style={{ background: "#060e1a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "16px" }}>
              <Image src="/enviroagent.png" alt="EnviroAgent" width={36} height={36} style={{ borderRadius: "8px" }} />
              <span style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.15rem", color: "#dce9f7" }}>EnviroAgent</span>
            </Link>
            <p style={{ fontSize: "0.875rem", color: "#4a6a8a", lineHeight: 1.7, maxWidth: "300px", marginBottom: "20px" }}>
              Your AI that modifies your world to make you win. Set commitments, deploy agents, and watch your environment reshape around your goals.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { Icon: Github, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Linkedin, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} style={{
                  width: "34px", height: "34px", borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#4a6a8a", textDecoration: "none",
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#3ecfc6")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#4a6a8a")}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <div style={{ marginTop: "24px" }}>
              <NewsletterSignup />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3ecfc6", marginBottom: "16px" }}>
              Navigation
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Home",     href: "/" },
                { label: "About",    href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Contact",  href: "/contact" },
                { label: "Dashboard",href: "/dashboard" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} style={{ color: "#4a6a8a", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#dce9f7")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#4a6a8a")}
                  >{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3ecfc6", marginBottom: "16px" }}>
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { Icon: Mail,    text: "vashu.agarwal@enviroagent.org" },
                { Icon: Phone,   text: "+91 7303571379" },
                { Icon: MapPin,  text: "India" },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Icon size={15} color="#3ecfc6" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem", color: "#4a6a8a" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontSize: "0.8rem", color: "#2a4060" }}>© 2026 EnviroAgent. All rights reserved.</span>
          <div style={{ display: "flex", gap: "20px" }}>
            {[{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }].map(item => (
              <Link key={item.label} href={item.href} style={{ fontSize: "0.8rem", color: "#2a4060", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#7fa8d4")}
                onMouseLeave={e => (e.currentTarget.style.color = "#2a4060")}
              >{item.label}</Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-of-type {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  )
}
