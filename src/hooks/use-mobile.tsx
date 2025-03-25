
import * as React from "react"

const MOBILE_BREAKPOINT = 640 // Changed from 768 to match our design system

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )
  
  React.useEffect(() => {
    // Function to check if device is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check immediately on mount
    checkIfMobile()
    
    // Set up event listener with debounce for better performance
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIfMobile, 100);
    };
    
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}
