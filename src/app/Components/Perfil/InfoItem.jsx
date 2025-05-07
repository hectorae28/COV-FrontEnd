export default function InfoItem({ label, value, icon: Icon, fullWidth = false }) {
    return (
        <div className={fullWidth ? "col-span-full" : "col-span-1"}>
            <div className="flex items-start">
                {Icon && (
                    <div className="mr-3 mt-0.5 text-[#D7008A]">
                        <Icon size={16} />
                    </div>
                )}
                <div>
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <p className="font-medium text-gray-800">{value}</p>
                </div>
            </div>
        </div>
    );
}