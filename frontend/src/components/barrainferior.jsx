import { useAuth } from "../context/sesion";

export default function BottomBar() {
  const { user } = useAuth();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-900 text-gray-200 py-3 px-6 flex justify-between items-center shadow-inner">
      <span className="text-sm">
        Configuraciones (en desarrollo)
      </span>

      <div className="flex items-center gap-2">
        <span className="text-sm">
          Usuario: <b>{user?.name || "Invitado"}</b>
        </span>
      </div>
    </footer>
  );
}
