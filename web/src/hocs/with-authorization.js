import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';

export function withAuthorization(Component, requiredPermission) {
  return function AuthorizedComponent(props) {
    const router = useRouter()
    const auth = useAuth()
    
    if (auth?.user?.is_staff !== requiredPermission) {
      // redireccionar al usuario a otra página si no tiene permiso
      router.push('/')
      return null
    }
    
    return <Component {...props} />
  }
}