import { Component } from '@angular/core';

@Component({
  selector: 'cb-terms',
  standalone: true,
  imports: [],
  template: `
<section class="bg-dark text-white py-5">
  <div class="container text-center py-3">
    <h1 class="display-5 fw-bold">Terms &amp; <span class="text-warning">Conditions</span></h1>
    <p class="text-white-50 mt-2">Last updated: January 2025</p>
  </div>
</section>
<section class="py-5">
  <div class="container" style="max-width:800px">
    <div class="card border-0 shadow-sm p-4">
      <h5 class="fw-bold mb-3">1. Acceptance of Terms</h5>
      <p class="text-muted">By accessing or using ClutchBids, you agree to be bound by these Terms and Conditions. If you do not agree, do not use the platform.</p>

      <h5 class="fw-bold mb-3 mt-4">2. Eligibility</h5>
      <p class="text-muted">You must be at least 18 years of age and a resident of Australia to use ClutchBids. You must complete identity verification before creating listings or making offers.</p>

      <h5 class="fw-bold mb-3 mt-4">3. Listings</h5>
      <p class="text-muted">All listings must be accurate and lawful. ClutchBids reserves the right to reject or remove any listing at its discretion. Selling stolen vehicles is prohibited and will result in immediate account termination and referral to authorities.</p>

      <h5 class="fw-bold mb-3 mt-4">4. Price Offers</h5>
      <p class="text-muted">Offers made through ClutchBids are expressions of intent only. ClutchBids is not a party to any transaction between buyers and sellers and bears no liability for disputes arising from such transactions.</p>

      <h5 class="fw-bold mb-3 mt-4">5. User Conduct</h5>
      <p class="text-muted">You must not use ClutchBids to harass, defraud, or mislead other users. Reports of misconduct are investigated and may result in warnings, suspension, or permanent bans.</p>

      <h5 class="fw-bold mb-3 mt-4">6. Intellectual Property</h5>
      <p class="text-muted">Content you post remains yours; you grant ClutchBids a non-exclusive licence to display it on the platform. ClutchBids branding and code are proprietary.</p>

      <h5 class="fw-bold mb-3 mt-4">7. Limitation of Liability</h5>
      <p class="text-muted">ClutchBids provides the platform "as is" and disclaims liability for any loss arising from the use of the platform or transactions conducted through it, to the maximum extent permitted by Australian law.</p>

      <h5 class="fw-bold mb-3 mt-4">8. Changes to Terms</h5>
      <p class="text-muted">We may update these terms at any time. Continued use of ClutchBids after changes constitutes acceptance of the new terms.</p>

      <h5 class="fw-bold mb-3 mt-4">9. Governing Law</h5>
      <p class="text-muted">These terms are governed by the laws of New South Wales, Australia.</p>

      <h5 class="fw-bold mb-3 mt-4">10. Contact</h5>
      <p class="text-muted">For legal enquiries: legal&#64;clutchbids.com.au</p>
    </div>
  </div>
</section>
`
})
export class TermsComponent {}
