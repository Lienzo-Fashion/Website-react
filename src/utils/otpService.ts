// Simulated OTP storage (in a real app, this would be handled by a backend)
const otpStore = new Map<string, { otp: string; timestamp: number }>();

// Generate a random 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// OTP expires after 5 minutes
const OTP_EXPIRY = 5 * 60 * 1000;

export const sendOtp = async (phone: string): Promise<void> => {
  try {
    const otp = generateOTP();
    otpStore.set(phone, {
      otp,
      timestamp: Date.now(),
    });

    // In a real application, you would integrate with an SMS service here
    console.log(`OTP sent to ${phone}: ${otp}`);
    
    return Promise.resolve();
  } catch (error) {
    return Promise.reject('Failed to send OTP');
  }
};

export const verifyOtp = async (phone: string, inputOtp: string): Promise<boolean> => {
  try {
    const storedData = otpStore.get(phone);
    
    if (!storedData) {
      return false;
    }

    const { otp, timestamp } = storedData;
    const isExpired = Date.now() - timestamp > OTP_EXPIRY;

    if (isExpired) {
      otpStore.delete(phone);
      return false;
    }

    const isValid = otp === inputOtp;
    
    if (isValid) {
      otpStore.delete(phone); // Clean up after successful verification
    }

    return isValid;
  } catch (error) {
    return false;
  }
};