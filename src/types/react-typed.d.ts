declare module 'react-typed' {
    import { Component } from 'react';
  
    interface TypedProps {
      strings: string[];
      typeSpeed?: number;
      backSpeed?: number;
      loop?: boolean;
      startDelay?: number;
      backDelay?: number;
      showCursor?: boolean;
      cursorChar?: string;
      smartBackspace?: boolean;
    }
  
    export default class Typed extends Component<TypedProps> {}
  }
  