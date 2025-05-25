"use client";

interface AvatarWithSpeechBubbleProps {
  message: string;
  avatarSrc: string;
  show: boolean;
  persistent?: boolean; // New prop for indefinite display
  centered?: boolean; // New prop to control positioning
}

export default function AvatarWithSpeechBubble({
  message,
  avatarSrc,
  show,
  persistent = false,
  centered = false,
}: AvatarWithSpeechBubbleProps) {
  if (!show) return null;

  const containerClasses = centered ? "relative" : "fixed top-4 right-4 z-50";

  return (
    <div className={containerClasses}>
      <div className="avatar-container">
        <img
          src={avatarSrc}
          alt="Chat helper avatar"
          className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
        />
        <div className="speech-bubble">
          {message.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              {index < message.split("\n").length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>

      {/* Custom CSS for avatar and speech bubble animations */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css?family=Baloo+2:400,800&display=swap");

        .avatar-container {
          position: relative;
          display: flex;
          align-items: center;
          animation: slideInBounce 2s ease-out forwards;
        }

        .speech-bubble {
          transform: translatey(0px);
          animation: ${persistent
            ? "float 5s ease-in-out infinite"
            : "float 5s ease-in-out infinite"};
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          letter-spacing: 2px;
          font-size: 12px;
          color: #774f38;
          background-color: #ece5ce;
          padding: 15px 20px;
          border-radius: 11px;
          position: relative;
          box-shadow: 10px 10px #83af9b;
          font-family: "Baloo 2", cursive;
          border: 1px solid #c8c8a9;
          margin-left: 15px;
          white-space: nowrap;
        }

        .speech-bubble:after {
          transform: translatey(0px);
          animation: ${persistent
            ? "float2 5s ease-in-out infinite"
            : "float2 5s ease-in-out infinite"};
          content: ".";
          font-weight: bold;
          -webkit-text-stroke: 0.5px #c8c8a9;
          -webkit-text-fill-color: #ece5ce;
          border: 1px solid #c8c8a9;
          text-shadow: 11px 11px #83af9b;
          text-align: left;
          font-size: 35px;
          width: 35px;
          height: 8px;
          line-height: 20px;
          border-radius: 11px;
          background-color: #ece5ce;
          position: absolute;
          display: block;
          bottom: -20px;
          left: -15px;
          box-shadow: 11px 11px #83af9b;
          z-index: -2;
        }

        @keyframes slideInBounce {
          0% {
            transform: ${centered
              ? "scale(0.5)"
              : "translateX(100px) translateY(-30px) scale(0.5)"};
            opacity: 0;
          }
          25% {
            transform: ${centered
              ? "scale(1.1)"
              : "translateX(-10px) translateY(10px) scale(1.1)"};
            opacity: 1;
          }
          50% {
            transform: ${centered
              ? "scale(0.95)"
              : "translateX(5px) translateY(-5px) scale(0.95)"};
            opacity: 1;
          }
          100% {
            transform: ${centered
              ? "scale(1)"
              : "translateX(0) translateY(0) scale(1)"};
            opacity: 1;
          }
        }

        @keyframes float {
          0% {
            transform: translatey(0px);
          }
          50% {
            transform: translatey(-10px);
          }
          100% {
            transform: translatey(0px);
          }
        }

        @keyframes float2 {
          0% {
            line-height: 20px;
            transform: translatey(0px);
          }
          55% {
            transform: translatey(-10px);
          }
          60% {
            line-height: 5px;
          }
          100% {
            line-height: 20px;
            transform: translatey(0px);
          }
        }
      `}</style>
    </div>
  );
}
