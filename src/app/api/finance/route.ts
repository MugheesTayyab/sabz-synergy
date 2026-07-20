import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Convert body to string, escape double quotes for the command line
    const jsonStr = JSON.stringify(body).replace(/"/g, '\\"');
    
    const cliPath = path.join(process.cwd(), 'python_services', 'cli.py');
    const command = `python "${cliPath}" "${jsonStr}"`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('Python Stderr:', stderr);
    }
    
    const result = JSON.parse(stdout);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate feasibility' },
      { status: 500 }
    );
  }
}
