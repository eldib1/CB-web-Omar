import { Component } from '@angular/core';

@Component({
  selector: 'cb-privacy',
  standalone: true,
  imports: [],
  template: `
<section class="bg-dark text-white py-5">
  <div class="container text-center py-3">
    <h1 class="display-5 fw-bold">Privacy <span class="text-warning">Policy</span></h1>
    <p class="text-white-50 mt-2">Last updated: January 2025</p>
  </div>
</section>
<section class="py-5">
  <div class="container" style="max-width:800px">
    <div class="card border-0 shadow-sm p-4">
      <h5 class="fw-bold mb-3">1. Information We Collect</h5>
      <p class="text-muted">We collect information you provide during registration (name, email, phone), identity verification (government-issued ID), listing content, messages, and usage data.</p>

      <h5 class="fw-bold mb-3 mt-4">2. How We Use Your Information</h5>
      <p class="text-muted">We use your information to: operate and improve the platform, verify your identity, send you notifications about your listings and offers, and ensure the safety of our community.</p>

      <h5 class="fw-bold mb-3 mt-4">3. Identity Documents</h5>
      <p class="text-muted">ID documents are stored securely with AES-256 encryption and are only accessible to authorised ClutchBids staff for the purpose of identity verification. They are deleted upon account closure.</p>

      <h5 class="fw-bold mb-3 mt-4">4. Data Sharing</h5>
      <p class="text-muted">We do not sell your personal data. We share data with trusted service providers (hosting, payment processing) where necessary under strict data processing agreements. We may disclose data to law enforcement when legally required.</p>

      <h5 class="fw-bold mb-3 mt-4">5. Cookies</h5>
      <p class="text-muted">We use essential cookies for authentication and analytics cookies to improve the platform. You can manage cookie preferences via your browser settings.</p>

      <h5 class="fw-bold mb-3 mt-4">6. Your Rights (Australian Privacy Act 1988)</h5>
      <p class="text-muted">You have the right to access, correct, or request deletion of your personal information. Submit requests to privacy&#64;clutchbids.com.au. We will respond within 30 days.</p>

      <h5 class="fw-bold mb-3 mt-4">7. Data Retention</h5>
      <p class="text-muted">Account data is retained for the duration of your account plus 7 years for legal and audit purposes. You may request deletion of non-required data at any time.</p>

      <h5 class="fw-bold mb-3 mt-4">8. Security</h5>
      <p class="text-muted">We implement industry-standard security measures including HTTPS, encrypted storage, and access controls. However, no system is 100% secure and we cannot guarantee absolute security.</p>

      <h5 class="fw-bold mb-3 mt-4">9. Contact</h5>
      <p class="text-muted">Privacy enquiries: privacy&#64;clutchbids.com.au</p>
    </div>
  </div>
</section>
`
})
export class PrivacyComponent {}
