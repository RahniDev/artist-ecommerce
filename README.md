# Full Stack Ecommerce Website

[View my live ecommerce site.](https://artist-ecommerce.vercel.app/)

### Technical Info

Frontend: React 19, TypeScript, Redux & Redux Toolkit, Material UI

Backend: Node, Express, TypeScript, MongoDB

Deployment: 
- Vercel (Frontend Hosting)
- Render (Backend Hosting)
- Cloudflare R2 (Image Storage)
- GitHub Actions (Continuous Integration)

### Features

- User Dashboard (update profile details & view order history)
- Admin Dashboard (Create, update & delete products, create categories, view orders & update order status)
- Checkout (payment with Braintree)
- Emails to user and admin after every order placed
- Email to user when order is shipped
- Multiple image upload 
- Thumbnails and modal on product page
- Related products section on product page
- Product breadcrumbs
- React multi-language translation using I18n
- Translation of product names using DeepL
- Newsletter signup form - Mailchimp
- Custom background colours for each art collection like gallery walls

### Security
- API Rate limiting
- Helmet security headers
- Password hashing with bcrypt
- JWT-based authentication with signed access tokens
- HTTP-only cookies
- Role-based authorization