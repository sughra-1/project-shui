import { z } from 'zod';

// Validates the body when a message is created or edited
export const messageSchema = z.object({
    text : z.string('Text must be a string').trim().min(1, 'Message cannot be empty'),
});
