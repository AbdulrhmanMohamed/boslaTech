import { useState } from "react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const inputCls =
  "w-full bg-cream border border-line rounded-2xl px-4 py-3 text-[13px] font-bold outline-none focus:border-green2 transition-colors";

const MESSAGES = {
  NOT_IMAGE: "اختَر ملف صورة صحيحًا (JPG أو PNG أو WebP)",
  TOO_LARGE: "الصورة كبيرة — الحد الأقصى 12 ميجابايت",
  BROKEN_IMAGE: "تعذّر قراءة الصورة — جرّب صورة أخرى",
  READ_FAILED: "تعذّر تحميل الملف من الجهاز",
  CANVAS_FAILED: "تعذّر تجهيز الصورة — جرّب صورة أخرى",
};

export const prepareImage = (file, maxDimension = 1000) =>
  new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("NOT_IMAGE"));
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      reject(new Error("TOO_LARGE"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("READ_FAILED"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("BROKEN_IMAGE"));
      image.onload = () => {
        const ratio = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * ratio));
        canvas.height = Math.max(1, Math.round(image.height * ratio));
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("CANVAS_FAILED"));
          return;
        }
        context.fillStyle = "#f7f3ec";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

export default function ImageUploader({
  value = "",
  onChange,
  title = "الصورة",
  hint = "اسحب الصورة هنا أو اختر ملفًا — يتم ضغطها تلقائيًا",
  empty = "لا توجد صورة بعد",
  previewAlt = "معاينة الصورة",
  shape = "square",
  onError,
  onBusyChange,
  maxDimension = 1000,
}) {
  const [busy, setBusy] = useState(false);

  const setWorking = (next) => {
    setBusy(next);
    onBusyChange?.(next);
  };

  const applyFile = async (file) => {
    if (!file) return;
    setWorking(true);
    try {
      const image = await prepareImage(file, maxDimension);
      onChange(image);
    } catch (error) {
      onError?.(MESSAGES[error.message] || "تعذّر تجهيز الصورة — جرّب مرة أخرى");
    } finally {
      setWorking(false);
    }
  };

  const onFileInput = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    applyFile(file);
  };

  const onDrop = (event) => {
    event.preventDefault();
    applyFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[11px] font-black text-muted">{title}</span>
        <span className="text-[9px] font-black text-green2 bg-[#e8f1ee] rounded-full px-2 py-1">معاينة مباشرة</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-4" onDragOver={(event) => event.preventDefault()} onDrop={onDrop}>
        <div className={cx("w-full sm:w-28 h-28 bg-cream border border-line overflow-hidden grid place-items-center shrink-0", shape === "circle" ? "rounded-full" : "rounded-2xl")}>
          {value ? (
            <img src={value} alt={previewAlt} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-muted px-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 mx-auto mb-1.5 opacity-50" aria-hidden="true">
                <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
                <path d="M3 8v8l9 5 9-5V8" />
                <path d="M12 13v8" />
              </svg>
              <span className="text-[9px] font-black">{empty}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2.5">
          <label className={cx("flex items-center justify-center gap-2 rounded-2xl border border-dashed border-green2/50 bg-[#e8f1ee]/50 py-2.5 text-[11px] font-black text-green2 cursor-pointer hover:bg-[#e8f1ee] transition-colors", busy && "opacity-60 cursor-wait")}>
            <input type="file" accept="image/*" onChange={onFileInput} disabled={busy} className="sr-only" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
            {busy ? "جاري تجهيز الصورة..." : "رفع صورة من الجهاز"}
          </label>
          <p className="text-[9.5px] font-bold text-muted text-center">{hint}</p>
          <input
            dir="ltr"
            value={value.startsWith("data:") ? "" : value}
            onChange={(event) => onChange(event.target.value)}
            className={cx(inputCls, "text-left")}
            placeholder="أو الصق رابط صورة https://..."
          />
          {value && (
            <button type="button" onClick={() => onChange("")} className="w-full rounded-xl bg-[#fbe9e6] text-[#a33b2c] py-2 text-[10px] font-black hover:bg-[#f8ddd8] transition-colors cursor-pointer">
              إزالة الصورة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
