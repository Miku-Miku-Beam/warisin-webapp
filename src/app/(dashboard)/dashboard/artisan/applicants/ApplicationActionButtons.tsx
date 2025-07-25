"use client";
import React, { useState } from "react";

interface ApplicationActionButtonsProps {
    applicationId: string;
    status: string;
}

const ApplicationActionButtons: React.FC<ApplicationActionButtonsProps> = ({ applicationId, status }) => {
    const [showModal, setShowModal] = useState<null | "approve" | "reject">(null);
    const [loading, setLoading] = useState(false);

    const handleAction = async (action: "approve" | "reject") => {
        setLoading(true);
        try {
            // Ganti dengan endpoint sesuai kebutuhan
            await fetch(`/api/application/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: applicationId }),
            });
            window.location.reload();
        } catch (err) {
            alert("Gagal memproses aplikasi.");
        } finally {
            setLoading(false);
            setShowModal(null);
        }
    };

    if (status !== "PENDING") return null;

    return (
        <>
            <div className="flex justify-end gap-4 mt-8 fixed">
                <button
                    className="bg-green-500 text-white px-6 py-2 rounded"
                    onClick={() => setShowModal("approve")}
                    disabled={loading}
                >
                    Approve
                </button>
                <button
                    className="bg-red-500 text-white px-6 py-2 rounded"
                    onClick={() => setShowModal("reject")}
                    disabled={loading}
                >
                    Reject
                </button>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white w-full h-full flex flex-col items-center justify-center rounded-none shadow-none p-0">
                        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4">Konfirmasi</h3>
                            <p className="mb-6">Yakin ingin {showModal === "approve" ? "menyetujui" : "menolak"} aplikasi ini?</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                                    onClick={() => setShowModal(null)}
                                    disabled={loading}
                                >
                                    Batal
                                </button>
                                <button
                                    className={`px-4 py-2 rounded text-white ${showModal === "approve" ? "bg-green-500" : "bg-red-500"}`}
                                    onClick={() => handleAction(showModal)}
                                    disabled={loading}
                                >
                                    {loading ? "Memproses..." : "Ya, Lanjutkan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ApplicationActionButtons;
