import { useActionState } from 'react'
import { API } from '../config';
import { Button, Input } from "@mui/material";

async function submitForm(formData) {
  try {
     await fetch(`${API}/contact`, {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
    });
  } catch (err: any) {
    return {
      success: false,
      message: err.message
    }
  }
}

const Contact = () => {
  const [formState, formAction] = useActionState(submitForm, null)

  return (
    <form action={formAction}>
      <Input name="name" placeholder="Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Your Message" required></textarea>
      <Button type="submit">Submit</Button>
    {formState?.success === true && (
      <p>{formState?.message}</p>
    )}
    {formState?.success === false && (
      <p>Error: {formState?.message}</p>
    )}
    </form>
  )
}

export default Contact