'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/app/stores/slice/useAuthStore';

interface ChatbotConfig {
  n8nChatUrl: string;
  metadata: {
    timestamp: string;
    version: string;
    userId: string;
    username: string;
    email: string;
  };
  onBeforeSend: (message: string) => { shouldSend: boolean; errorMessage?: string };
  onError: (error: Error | string | { message?: string; [key: string]: unknown }) => { showToUser: boolean; message: string } | void;
  theme: {
    button: {
      backgroundColor: string;
      right: number;
      bottom: number;
      size: number;
      iconColor: string;
      customIconSrc: string;
      customIconSize: number;
      customIconBorderRadius: number;
      autoWindowOpen: {
        autoOpen: boolean;
        openDelay: number;
      };
      borderRadius: string;
    };
    tooltip: {
      showTooltip: boolean;
      tooltipMessage: string;
      tooltipBackgroundColor: string;
      tooltipTextColor: string;
      tooltipFontSize: number;
    };
    chatWindow: {
      borderRadiusStyle: string;
      avatarBorderRadius: number;
      messageBorderRadius: number;
      showTitle: boolean;
      title: string;
      titleAvatarSrc: string;
      welcomeMessage: string;
      errorMessage: string;
      backgroundColor: string;
      height: number;
      width: number;
      fontSize: number;
      starterPrompts: string[];
      starterPromptFontSize: number;
      clearChatOnReload: boolean;
      botMessage: {
        backgroundColor: string;
        textColor: string;
        showAvatar: boolean;
        avatarSrc: string;
      };
      userMessage: {
        backgroundColor: string;
        textColor: string;
        showAvatar: boolean;
        avatarSrc: string;
      };
      textInput: {
        placeholder: string;
        backgroundColor: string;
        textColor: string;
        sendButtonColor: string;
        maxChars: number;
        maxCharsWarningMessage: string;
        autoFocus: boolean;
        borderRadius: number;
        sendButtonBorderRadius: number;
      };
      uploadsConfig: {
        enabled: boolean;
        acceptFileTypes: string[];
        maxFiles: number;
        maxSizeInMB: number;
      };
      voiceInputConfig: {
        enabled: boolean;
        maxRecordingTime: number;
        recordingNotSupportedMessage: string;
      };
    };
    zIndex?: number; // Thêm thuộc tính zIndex
  };
}

declare global {
  interface Window {
    Chatbot: {
      init: (config: ChatbotConfig) => void;
      destroy: () => void;
    };
  }
}

const DEFAULT_CHAT_URL = 'https://103226109.flown8n.com/webhook/5667457e-00d0-4964-91d4-281758f82897/chat';

export default function Chatbot() {
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to initialize the chat
  const initChat = useCallback(() => {
    if (typeof window === 'undefined' || !isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      // Clean up any existing chat instance
      if (window.Chatbot?.destroy) {
        window.Chatbot.destroy();
      }

      // Create a new script element
      const script = document.createElement('script');
      script.type = 'module';
      script.defer = true;
      script.innerHTML = `
        import Chatbot from "https://cdn.n8nchatui.com/v1/embed.js";
        window.Chatbot = Chatbot;
        Chatbot.init({
          "n8nChatUrl": "${DEFAULT_CHAT_URL}",
          "metadata": {
            "timestamp": new Date().toISOString(),
            "version": "1.0.0",
            "userId": "${user?.id || 'anonymous'}",
            "username": "${user?.username || 'anonymous'}",
            "email": "${user?.email || ''}"
          },
          "onBeforeSend": (message) => {
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
              "tooltipMessage": "Chào ${user?.full_name || 'bạn'}! Tôi là trợ lí AI! Tôi có thể giúp gì cho bạn?",
              "tooltipBackgroundColor": "#4f46e5",
              "tooltipTextColor": "#ffffff",
              "tooltipFontSize": 14
            },
            "chatWindow": {
              "borderRadiusStyle": "rounded",
              "avatarBorderRadius": 25,
              "messageBorderRadius": 6,
              "showTitle": true,
              "title": "Xin chào ${user?.full_name || ''}",
              "titleAvatarSrc": "${user?.avatar_url || 'https://www.svgrepo.com/show/339963/chat-bot.svg'}",
              "welcomeMessage": "Xin chào ${user?.full_name || 'bạn'}! Tôi có thể giúp gì cho bạn hôm nay?",
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
              "renderMarkdown": false,
              "renderHTML": true,
              "markdownToHtml": true,
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
                "avatarSrc": "${user?.avatar_url || 'https://www.svgrepo.com/show/532363/user-alt-1.svg'}"
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
            },
            "zIndex": 10 // Đặt giá trị z-index mong muốn ở đây
          }
        });
      `;

      script.onload = () => {
        setIsLoading(false);
      };

      script.onerror = (err) => {
        console.error('Failed to load chat script:', err);
        setError('Không thể tải trò chuyện. Vui lòng thử lại sau.');
        setIsLoading(false);
      };

      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
        if (window.Chatbot?.destroy) {
          window.Chatbot.destroy();
        }
      };
    } catch (err) {
      console.error('Error initializing chat:', err);
      setError('Có lỗi xảy ra khi khởi tạo trò chuyện.');
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Initialize chat when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      initChat();
    } else {
      // Clean up chat if user logs out
      if (window.Chatbot?.destroy) {
        window.Chatbot.destroy();
      }
    }
  }, [isAuthenticated, initChat]);

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="w-14 h-14 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full flex items-center">
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  // The chat button is rendered by the n8n Chat UI script
  return null;
}