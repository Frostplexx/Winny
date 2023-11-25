import * as fs from 'fs';
import * as path from 'path';

export function getCurrentAnnouncement(): any {
    const filePath = path.join('src', 'data', 'announcement.json');
    const rawData = fs.readFileSync(filePath);
    const jsonData = JSON.parse(rawData.toString());
    return jsonData;
}

export function setAnnouncement(announcement: Announcement): void {
    const filePath = path.join('src','data', 'announcement.json');

    const data = JSON.stringify(announcement, null, 2); // Pretty format the JSON
    fs.writeFileSync(filePath, data);
}
export interface Announcement {
  name: string;
  description: string;
  buttonLabel: string;
  timestamp: number;
}