import fs from 'fs';
import { Request } from 'express';
import { AppError } from 'middlewares/error';

const createRegex = (value: string) =>
  new RegExp(value.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
const parseJSON = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new AppError('Failed to parse JSON', 400);
  }
}
const parseReqBody = (req: Request) => {
  try {
    Object.keys(req.body).forEach(key => {
      req.body[key] = parseJSON(req.body[key])
    })
    return req.body
  } catch (error) {
    throw new AppError('Failed to parse request body', 400);
  }
}

function generateNumber(length: number = 4): number {
  if (length !== 4) {
    throw new Error('Required 4 length');
  }
  return Math.floor(1000 + Math.random() * 9000);
}
// Ensure all required directories exist
const ensureDirectoryExists = (directory: string) => {
  if (!fs.existsSync(directory)) {
    try {
      fs.mkdirSync(directory, { recursive: true });
      console.info(`Created directory: ${directory}`);
    } catch (error) {
      console.warn(`Error creating directory ${directory}:`, error);
      throw new Error(`Failed to create upload directory: ${directory}`);
    }
  }
};

// capitalize first letter and after space first letter also
const capitalizeFirstLetter = (str: string) => {
  return str ? str.replace(/\b\w/g, (char) => char.toUpperCase()) : "";
}
export { createRegex, parseJSON, generateNumber, ensureDirectoryExists,  parseReqBody, capitalizeFirstLetter }