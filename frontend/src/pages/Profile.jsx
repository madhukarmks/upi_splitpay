import { useAuth } from "../context/AuthContext";
import PageTitle from "../components/PageTitle";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="content narrow">
      <PageTitle
        title="Profile"
        subtitle="Your account information."
      />

      <section className="panel profile">
        <div className="profile-avatar">
          {user?.name?.[0]}
        </div>

        <h2>{user?.name}</h2>

        <p>{user?.email}</p>

        <span className="badge success">
          {user?.role}
        </span>
      </section>
    </div>
  );
}