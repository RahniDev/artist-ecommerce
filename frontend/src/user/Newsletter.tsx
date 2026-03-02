export default function Newsletter() {
  return (
    <>
    <h3 className="newsletter-title">Newsletter</h3>
    <form
      className="newsletter-form"
      action="https://gmail.us3.list-manage.com/subscribe/post?u=c4db4caa3741bf741e810fba9&id=9b6a0b46d5&f_id=003c27e1f0"
      method="post"
      target="_blank"
      noValidate
    >
      <input
        className="newsletter-input"
        type="email"
        name="EMAIL"
        placeholder="Enter your email"
        required
      />
      <button className="newsletter-button" type="submit">
        Subscribe
      </button>
    </form>
    </>
  );
}