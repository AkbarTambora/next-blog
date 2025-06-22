"use server";

import bcrypt from "bcrypt";
import { RegisterFormSchema } from "@/lib/rules";
import { getCollection } from "@/lib/db";
import { redirect } from "next/navigation";

export async function register(state, formData) {
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  // Validate form fields
  const validatedFields = RegisterFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  // If any form field is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      email: formData.get("email"),
    };
  }

  // Extract form fields
  const { email, password } = validatedFields.data;

  // Check if email is already registered
  const userCollection = await getCollection("users");
  if (!userCollection)
    return {
      errors: { email: "Server error, please try again later." },
    };

  const existingUser = await userCollection.findOne({ email });
  if (existingUser) {
    return {
      errors: { 
        email: "Email is already registered." 
        },
    };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save in DB
  const results = await userCollection.insertOne({
    email,
    password: hashedPassword,
  });

  // Create a session

  // Redirect to Dashboard
  redirect("/dashboard");
}
