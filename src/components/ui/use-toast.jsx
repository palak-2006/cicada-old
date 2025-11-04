import * as React from "react"
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "./toast"

const ToastContext = React.createContext({
  toast: () => {},
})

export function useToast() {
  return React.useContext(ToastContext)
}

export function Toaster({ children }) {
  const [toasts, setToasts] = React.useState([])

  const addToast = ({ title, description, variant }) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, description, variant }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      <ToastProvider>
        {children}
        {toasts.map((t) => (
          <Toast key={t.id} variant={t.variant}>
            <div className="grid gap-1">
              <ToastTitle>{t.title}</ToastTitle>
              {t.description && <ToastDescription>{t.description}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}
