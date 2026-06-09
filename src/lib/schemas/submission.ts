
import { z } from "zod";

export const submissionSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    title: z.string().min(5, { message: "Title must be at least 5 characters." }),
    category: z.enum(["Folklore", "Memory", "Recipe", "Ritual", "Song"]),
    content: z.string().min(50, { message: "Story content must be at least 50 characters." }),
    location: z.string().optional(),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
