import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FaqItem { q: string; a: string; open: boolean; }

@Component({
  selector: 'cb-faq',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './faq.component.html'
})
export class FaqComponent {
  readonly faqs = signal<FaqItem[]>([
    { q: 'How do I create a listing?', a: 'After verifying your identity, go to "Create Listing" from your dashboard. Fill in vehicle details, upload photos and documents, and submit for admin approval. Once approved it will go live.', open: false },
    { q: 'What is a Listing Code?', a: 'Some accounts require a Listing Code to publish a car. These codes can be assigned by an admin or come with a verified account. Contact support if you need one.', open: false },
    { q: 'How does the offer system work?', a: 'Buyers send price offers on any active listing. The seller can accept or reject the offer. If accepted, both parties are connected via a dedicated chat session to finalise the deal.', open: false },
    { q: 'Is my personal information safe?', a: 'Yes. Your identity documents are stored securely and only reviewed by verified ClutchBids staff for verification purposes. We never share your data with third parties. See our Privacy Policy for details.', open: false },
    { q: 'How long does listing approval take?', a: 'Our team typically reviews listings within 24 hours. You will receive a notification once the review is complete.', open: false },
    { q: 'Can I edit a listing after it is published?', a: 'You can deactivate a listing and create a new one. Direct edits to live listings are not currently supported to maintain marketplace integrity.', open: false },
    { q: 'What happens if I get a bad report?', a: 'Reports are reviewed by our admin team. Depending on the severity, actions range from a warning through to account suspension. You can appeal through our support chat.', open: false },
    { q: 'How do I contact support?', a: 'Use the built-in chat feature to start a conversation with our support team, or email us at support@clutchbids.com.au.', open: false }
  ]);

  toggle(index: number) {
    this.faqs.update(items => items.map((f, i) => ({ ...f, open: i === index ? !f.open : f.open })));
  }
}
