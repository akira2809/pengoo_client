'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Chatbot: any;
  }
}

export default function Chatbot() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load the N8N Chat UI script
      const script = document.createElement('script');
      script.type = 'module';
      script.defer = true;
      script.innerHTML = `
        import Chatbot from "https://cdn.n8nchatui.com/v1/embed.js";
        window.Chatbot = Chatbot;
        Chatbot.init({
          "n8nChatUrl": "https://103226109.flown8n.com/webhook/5667457e-00d0-4964-91d4-281758f82897/chat",
          "metadata": {
            "timestamp": new Date().toISOString(),
            "version": "1.0.0"
          },
          "onBeforeSend": (message) => {
            // Validate message is not empty and contains meaningful content
            const trimmedMessage = message.trim();
            if (!trimmedMessage || trimmedMessage.length < 2) {
              return {
                shouldSend: false,
                errorMessage: 'Vui lòng nhập câu hỏi rõ ràng hơn.'
              };
            }
            return { shouldSend: true };
          },
          "onError": (error) => {
            console.error('Chat Error:', error);
            // Handle specific Supabase Vector Store error
            if (error?.includes('Supabase_Vector_Store') || error?.includes('input')) {
              return {
                showToUser: true,
                message: 'Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại với câu hỏi khác.'
              };
            }
            return {
              showToUser: true,
              message: 'Có lỗi xảy ra. Vui lòng thử lại sau.'
            };
          },
          "theme": {
            "button": {
              "backgroundColor": "#4f46e5",
              "right": 20,
              "bottom": 20,
              "size": 50,
              "iconColor": "#ffffff",
              "customIconSrc": "https://www.svgrepo.com/show/339963/chat-bot.svg",
              "customIconSize": 60,
              "customIconBorderRadius": 15,
              "autoWindowOpen": {
                "autoOpen": false,
                "openDelay": 2
              },
              "borderRadius": "rounded"
            },
            "tooltip": {
              "showTooltip": true,
              "tooltipMessage": "Chào bạn tôi là trợ lí AI! Tôi có thể giúp gì cho bạn?",
              "tooltipBackgroundColor": "#4f46e5",
              "tooltipTextColor": "#ffffff",
              "tooltipFontSize": 14
            },
            "chatWindow": {
              "borderRadiusStyle": "rounded",
              "avatarBorderRadius": 25,
              "messageBorderRadius": 6,
              "showTitle": true,
              "title": "Trợ lý ảo",
              "titleAvatarSrc": "https://www.svgrepo.com/show/339963/chat-bot.svg",
              "welcomeMessage": "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
              "errorMessage": "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
              "backgroundColor": "#ffffff",
              "height": 500,
              "width": 350,
              "fontSize": 14,
              "starterPrompts": [
                "Bạn có thể giúp gì cho tôi?",
                "Tôi cần hỗ trợ"
              ],
              "starterPromptFontSize": 14,
              "renderHTML": true,
              "clearChatOnReload": false,
              "botMessage": {
                "backgroundColor": "#f3f4f6",
                "textColor": "#1f2937",
                "showAvatar": true,
                "avatarSrc": "https://www.svgrepo.com/show/334455/bot.svg"
              },
              "userMessage": {
                "backgroundColor": "#4f46e5",
                "textColor": "#ffffff",
                "showAvatar": true,
                "avatarSrc": "https://www.svgrepo.com/show/532363/user-alt-1.svg"
              },
              "textInput": {
                "placeholder": "Nhập câu hỏi của bạn...",
                "backgroundColor": "#ffffff",
                "textColor": "#1f2937",
                "sendButtonColor": "#4f46e5",
                "maxChars": 500,
                "maxCharsWarningMessage": "Tin nhắn của bạn đã vượt quá giới hạn ký tự. Vui lòng nhập ít hơn 500 ký tự.",
                "autoFocus": true,
                "borderRadius": 20,
                "sendButtonBorderRadius": 20
              },
              "uploadsConfig": {
                "enabled": true,
                "acceptFileTypes": [
                  "jpeg",
                  "jpg",
                  "png",
                  "pdf",
                  "doc",
                  "docx"
                ],
                "maxFiles": 5,
                "maxSizeInMB": 10
              },
              "voiceInputConfig": {
                "enabled": true,
                "maxRecordingTime": 30,
                "recordingNotSupportedMessage": "Trình duyệt của bạn không hỗ trợ ghi âm. Vui lòng sử dụng Chrome hoặc Firefox."
              }
            }
          }
        });
      `;
      document.body.appendChild(script);

      return () => {
        // Cleanup
        document.body.removeChild(script);
        if (window.Chatbot && window.Chatbot.destroy) {
          window.Chatbot.destroy();
        }
      };
    }
  }, []);

  return null; // The chat button is rendered by the N8N Chat UI script
}