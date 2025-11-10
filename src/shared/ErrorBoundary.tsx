import React, { type ReactNode } from "react";

interface Props {
   children: ReactNode;
   fallback?: ReactNode;
}

interface State {
   hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(): State {
      return { hasError: true };
   }

   render() {
      if (this.state.hasError) {
         return this.props.fallback || (
            <div className="p-4 text-center">
               <h2 className="text-xl font-semibold text-red-600">
                  Something went wrong
               </h2>
               <button
                  onClick={() => this.setState({ hasError: false })}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
               >
                  Please try again or navigate to the home page
               </button>
            </div>
         );
      }

      return this.props.children;
   }
}

export default ErrorBoundary;
