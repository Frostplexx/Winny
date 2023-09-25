// Function to generate time based UUID
import { v4 as uuidv4 } from 'uuid';
export const generateTimeBasedUUID = (): string => {
	const timestamp = Date.now();
	const uuid = uuidv4();
	return `${timestamp}-${uuid}`;
}