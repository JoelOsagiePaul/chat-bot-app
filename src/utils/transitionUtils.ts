
export const transitionConfig = {
  enter: 225,
  exit: 195,
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
} as const;


export const createTransition = (
  property: string | string[],
  duration: number = transitionConfig.enter,
  easing: string = transitionConfig.easing.easeInOut
): string => {
  const properties = Array.isArray(property) ? property : [property];
  return properties
    .map((prop) => `${prop} ${duration}ms ${easing}`)
    .join(', ');
};


export const animations = {
  fadeIn: {
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animation: 'fadeIn 0.3s ease-in',
  },
  
  scaleIn: {
    '@keyframes scaleIn': {
      from: { opacity: 0, transform: 'scale(0.8)' },
      to: { opacity: 1, transform: 'scale(1)' },
    },
    animation: 'scaleIn 0.225s cubic-bezier(0.0, 0, 0.2, 1)',
  },

  slideUp: {
    '@keyframes slideUp': {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animation: 'slideUp 0.225s cubic-bezier(0.0, 0, 0.2, 1)',
  },

  typing: {
    '@keyframes typing': {
      '0%, 60%, 100%': {
        opacity: 0.3,
        transform: 'translateY(0)',
      },
      '30%': {
        opacity: 1,
        transform: 'translateY(-10px)',
      },
    },
  },
} as const;


export const transitionPresets = {
  fab: {
    enter: transitionConfig.enter,
    exit: transitionConfig.exit,
  },
  
  chatWindow: {
    enter: transitionConfig.enter,
    exit: transitionConfig.exit,
  },

  modal: {
    enter: 300,
    exit: 200,
  },
} as const;
