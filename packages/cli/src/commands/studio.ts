import pc from 'picocolors';
import { startStudioServer, type StudioServerOptions } from '../server/studio-server.js';
import { formatBanner } from '../ui/formatters.js';

export interface StudioCommandOptions extends StudioServerOptions {
  open?: boolean;
}

export async function runStudioCommand(options: StudioCommandOptions = {}): Promise<void> {
  const instance = await startStudioServer(options);

  console.log(formatBanner());
  console.log('');
  console.log(pc.bold(pc.green('✓ Career-Ops Web Studio running at:')));
  console.log(pc.bold(pc.cyan(`  http://127.0.0.1:${instance.port}/`)));
  console.log('');
  console.log(pc.dim('Press Ctrl+C to stop the studio server.'));
}
