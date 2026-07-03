"use client";

import { changePassword, deleteAccount, updateAccount } from "@/lib/api/authApi";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface AccountSettingsFormProps {
  initialName: string;
  email: string;
}

const labels = {
  profileTitle: "\u041f\u0440\u043e\u0444\u0438\u043b\u044c",
  name: "\u0418\u043c\u044f",
  saveName: "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u043c\u044f",
  saved: "\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043e",
  saving: "\u0421\u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c...",
  passwordTitle: "\u041f\u0430\u0440\u043e\u043b\u044c",
  currentPassword: "\u0422\u0435\u043a\u0443\u0449\u0438\u0439 \u043f\u0430\u0440\u043e\u043b\u044c",
  newPassword: "\u041d\u043e\u0432\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c \u043e\u0442 8 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
  changePassword: "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u0430\u0440\u043e\u043b\u044c",
  changing: "\u0418\u0437\u043c\u0435\u043d\u044f\u0435\u043c...",
  passwordChanged: "\u041f\u0430\u0440\u043e\u043b\u044c \u0438\u0437\u043c\u0435\u043d\u0451\u043d",
  dangerTitle: "\u0423\u0434\u0430\u043b\u0435\u043d\u0438\u0435 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430",
  dangerText: "\u0411\u0443\u0434\u0443\u0442 \u0443\u0434\u0430\u043b\u0435\u043d\u044b \u0432\u0430\u0448 \u043f\u0440\u043e\u0444\u0438\u043b\u044c, \u043a\u043e\u043b\u043e\u0434\u044b, \u043a\u0430\u0440\u0442\u044b, \u043f\u0430\u043f\u043a\u0438, \u0433\u0440\u0443\u043f\u043f\u044b, \u0434\u043e\u0441\u0442\u0443\u043f\u044b \u0438 \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0441. \u042d\u0442\u043e \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043d\u0435\u043b\u044c\u0437\u044f \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u044c.",
  confirmDelete: "\u042f \u043f\u043e\u043d\u0438\u043c\u0430\u044e, \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442",
  deleteAccount: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442",
  deleting: "\u0423\u0434\u0430\u043b\u044f\u0435\u043c...",
  showPassword: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043f\u0430\u0440\u043e\u043b\u044c",
  hidePassword: "\u0421\u043a\u0440\u044b\u0442\u044c \u043f\u0430\u0440\u043e\u043b\u044c",
  error: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f",
};

function PasswordField({ value, onChange, placeholder, visible, onToggle }: { value: string; onChange: (value: string) => void; placeholder: string; visible: boolean; onToggle: () => void }) {
  return (
    <div className="passwordInputWrap">
      <input className="input passwordInput" type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      <button className="passwordVisibilityButton" type="button" aria-label={visible ? labels.hidePassword : labels.showPassword} aria-pressed={visible} onClick={onToggle}>
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

const AccountSettingsForm = ({ initialName, email }: AccountSettingsFormProps) => {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [name, setName] = useState(initialName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [visiblePasswordField, setVisiblePasswordField] = useState<"current" | "new" | "delete" | null>(null);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileMessage("");
    setIsSavingName(true);

    try {
      const result = await updateAccount({ name: name.trim() || null });
      setName(result.user.name ?? "");
      await updateSession({ name: result.user.name });
      router.refresh();
      setProfileMessage(labels.saved);
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : labels.error);
    } finally {
      setIsSavingName(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage("");
    setIsChangingPassword(true);

    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage(labels.passwordChanged);
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : labels.error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDeleteError("");

    if (!deleteConfirmed) return;

    setIsDeleting(true);

    try {
      await deleteAccount({ currentPassword: deletePassword });
      await signOut({ callbackUrl: "/register" });
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : labels.error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="sectionBlock">
      <form className="card sectionBlock" onSubmit={handleProfileSubmit}>
        <div>
          <h2 className="sectionTitle">{labels.profileTitle}</h2>
          <p className="metaText">Email: {email}</p>
        </div>

        <label>
          <span className="metaText mb-2 block">{labels.name}</span>
          <input className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder={labels.name} />
        </label>

        {profileMessage && <p className="metaText">{profileMessage}</p>}

        <div className="actionRow justify-end">
          <button className="button" type="submit" disabled={isSavingName}>{isSavingName ? labels.saving : labels.saveName}</button>
        </div>
      </form>

      <form className="card sectionBlock" onSubmit={handlePasswordSubmit}>
        <h2 className="sectionTitle">{labels.passwordTitle}</h2>

        <PasswordField value={currentPassword} onChange={setCurrentPassword} placeholder={labels.currentPassword} visible={visiblePasswordField === "current"} onToggle={() => setVisiblePasswordField((value) => value === "current" ? null : "current")} />
        <PasswordField value={newPassword} onChange={setNewPassword} placeholder={labels.newPassword} visible={visiblePasswordField === "new"} onToggle={() => setVisiblePasswordField((value) => value === "new" ? null : "new")} />

        {passwordMessage && <p className="metaText">{passwordMessage}</p>}

        <div className="actionRow justify-end">
          <button className="button" type="submit" disabled={isChangingPassword || !currentPassword || newPassword.length < 8}>{isChangingPassword ? labels.changing : labels.changePassword}</button>
        </div>
      </form>

      <form className="card sectionBlock" onSubmit={handleDeleteSubmit}>
        <div>
          <h2 className="sectionTitle text-[var(--colorDanger)]">{labels.dangerTitle}</h2>
          <p className="metaText">{labels.dangerText}</p>
        </div>

        <PasswordField value={deletePassword} onChange={setDeletePassword} placeholder={labels.currentPassword} visible={visiblePasswordField === "delete"} onToggle={() => setVisiblePasswordField((value) => value === "delete" ? null : "delete")} />

        <label className="flex items-start gap-3 text-[var(--colorTextMuted)]">
          <input className="mt-1" type="checkbox" checked={deleteConfirmed} onChange={(event) => setDeleteConfirmed(event.target.checked)} />
          <span>{labels.confirmDelete}</span>
        </label>

        {deleteError && <p className="appError">{deleteError}</p>}

        <div className="actionRow justify-end">
          <button className="button buttonDanger" type="submit" disabled={isDeleting || !deleteConfirmed || !deletePassword}>
            <Trash2 size={18} />
            {isDeleting ? labels.deleting : labels.deleteAccount}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettingsForm;