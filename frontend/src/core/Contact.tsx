import { useFormState } from 'react-dom'
import { API } from '../config';
import { Button, Input } from "@mui/material";

async function submitForm(formData: FormData) {
  const response = await fetch(`${API}/contact`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to submit contact form');
  }
  return response.json();
}

const Contact = () => {
  const [state, formAction] = useFormState(submitForm, {
    success: false,
    error: null
  })

  return (
    <form action={submitForm}>
      <Input name="name" placeholder="Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Your Message" required></textarea>
      <Button type="submit">Submit</Button>

    </form>
  )
}

export default Contact