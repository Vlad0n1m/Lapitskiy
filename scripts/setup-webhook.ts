/**
 * Telegram Webhook Setup Script
 * 
 * Использование:
 * 1. Development: npm run setup-webhook-dev
 * 2. Production: npm run setup-webhook-prod
 * 
 * Требования:
 * - Заполненные переменные окружения в .env.local
 * - Доступный публичный URL для webhook (ngrok для dev)
 */

import { setWebhook, getWebhookInfo, deleteWebhook } from '../lib/telegram';

async function main() {
    const command = process.argv[2];
    const customUrl = process.argv[3];

    console.log('🤖 Telegram Webhook Setup Tool\n');

    // Проверяем наличие необходимых env переменных
    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error('❌ Error: TELEGRAM_BOT_TOKEN not found in environment variables');
        process.exit(1);
    }

    switch (command) {
        case 'set':
            await setupWebhook(customUrl);
            break;
        
        case 'info':
            await showWebhookInfo();
            break;
        
        case 'delete':
            await removeWebhook();
            break;
        
        default:
            showHelp();
    }
}

async function setupWebhook(customUrl?: string) {
    try {
        let webhookUrl: string;

        if (customUrl) {
            webhookUrl = customUrl;
        } else {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
            
            if (!appUrl) {
                console.error('❌ Error: NEXT_PUBLIC_APP_URL not found');
                console.log('\nFor development with ngrok:');
                console.log('  npm run setup-webhook set https://your-ngrok-url.ngrok.io');
                process.exit(1);
            }

            webhookUrl = appUrl;
        }

        // Добавляем /api/telegram/webhook к URL
        if (!webhookUrl.endsWith('/api/telegram/webhook')) {
            webhookUrl = `${webhookUrl.replace(/\/$/, '')}/api/telegram/webhook`;
        }

        console.log(`🔧 Setting webhook to: ${webhookUrl}`);

        const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
        const success = await setWebhook(webhookUrl, secretToken);

        if (success) {
            console.log('✅ Webhook set successfully!\n');
            await showWebhookInfo();
        } else {
            console.error('❌ Failed to set webhook');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error setting webhook:', error);
        process.exit(1);
    }
}

async function showWebhookInfo() {
    try {
        console.log('📊 Current webhook info:\n');
        const info = await getWebhookInfo();

        if (info) {
            console.log(`URL: ${info.url || 'Not set'}`);
            console.log(`Has custom certificate: ${info.has_custom_certificate}`);
            console.log(`Pending update count: ${info.pending_update_count}`);
            console.log(`Max connections: ${info.max_connections || 'Default (40)'}`);
            
            if (info.last_error_date) {
                const errorDate = new Date(info.last_error_date * 1000);
                console.log(`\n⚠️  Last error: ${info.last_error_message}`);
                console.log(`   Date: ${errorDate.toLocaleString()}`);
            } else {
                console.log('\n✅ No errors');
            }

            if (info.allowed_updates) {
                console.log(`\nAllowed updates: ${info.allowed_updates.join(', ')}`);
            }
        } else {
            console.log('❌ Failed to get webhook info');
        }
    } catch (error) {
        console.error('❌ Error getting webhook info:', error);
        process.exit(1);
    }
}

async function removeWebhook() {
    try {
        console.log('🗑️  Deleting webhook...');
        const success = await deleteWebhook();

        if (success) {
            console.log('✅ Webhook deleted successfully!');
        } else {
            console.error('❌ Failed to delete webhook');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error deleting webhook:', error);
        process.exit(1);
    }
}

function showHelp() {
    console.log('Usage: npm run setup-webhook [command] [url]\n');
    console.log('Commands:');
    console.log('  set [url]    Set webhook (uses NEXT_PUBLIC_APP_URL if url not provided)');
    console.log('  info         Show current webhook information');
    console.log('  delete       Delete webhook\n');
    console.log('Examples:');
    console.log('  npm run setup-webhook set https://your-app.vercel.app');
    console.log('  npm run setup-webhook set https://abc123.ngrok.io');
    console.log('  npm run setup-webhook info');
    console.log('  npm run setup-webhook delete\n');
    console.log('Development with ngrok:');
    console.log('  1. Run: ngrok http 3000');
    console.log('  2. Copy the https URL');
    console.log('  3. Run: npm run setup-webhook set https://your-url.ngrok.io\n');
}

// Run the script
main().catch(console.error);

