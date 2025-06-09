import { useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../store/cart';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { getApiUrl } from '../config/api';

interface Product {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    price: string; // can convert to float
}

interface Event {
    id: number;
    name: string;
    products: Product[];
}

interface Storefront {
    id: number;
    name: string;
    events: Event[];
}

export default function MainScreen({ token }: { token: string }) {
    const [storefronts, setStorefronts] = useState<Storefront[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { cart, increment, decrement, clear } = useCart();
    const { canInstall, promptInstall } = useInstallPrompt();

    const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(getApiUrl('/storefronts'), {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setStorefronts(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load storefronts');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [token]);

    if (loading) return <div className="p-4">Loading products…</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-24 text-gray-800 relative">
            {canInstall && (
                <button
                    onClick={promptInstall}
                    className="mb-4 text-sm text-indigo-600 underline hover:text-indigo-800"
                >
                    Install Bruttobar App
                </button>
            )}
            <h1 className="text-2xl font-semibold mb-4">Bruttobar</h1>

            {storefronts.map((store) => (
                <div key={store.id} className="mb-6">
                    <h2 className="text-lg font-bold mt-4">{store.name}</h2>
                    {store.events.map((event) => (
                        <div key={event.id} className="mt-2">
                            <h3 className="text-sm font-semibold text-gray-600">{event.name}</h3>
                            <ul className="space-y-4 mt-2">
                                {event.products.map((item) => {
                                    const qty = cart[item.id.toString()]?.quantity || 0;
                                    const inCart = qty > 0;
                                    const parsedPrice = parseFloat(item.price);

                                    return (
                                        <li
                                            key={item.id}
                                            className={`flex items-center gap-4 p-3 rounded border shadow-sm transition ${inCart ? 'border-indigo-500 bg-indigo-50' : ''
                                                }`}
                                        >
                                            <img
                                                src={item.image || 'https://via.placeholder.com/40?text=🍹'}
                                                alt=""
                                                className="w-10 h-10 rounded bg-gray-100 object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{item.name}</div>
                                                {item.description && (
                                                    <div className="text-sm text-gray-500">{item.description}</div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-700">
                                                    {parsedPrice} kr
                                                    {qty > 0 && (
                                                        <span className="ml-2 text-xs text-gray-500">
                                                            ({qty * parsedPrice} kr)
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <button
                                                        onClick={() =>
                                                            decrement({
                                                                id: item.id.toString(),
                                                                name: item.name,
                                                                price: parsedPrice,
                                                                logoUrl: item.image ?? '',
                                                                description: item.description ?? '',
                                                            })
                                                        }
                                                        className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-sm font-semibold rounded-l"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-3 py-1 bg-white border-y text-sm w-8 text-center">{qty}</span>
                                                    <button
                                                        onClick={() =>
                                                            increment({
                                                                id: item.id.toString(),
                                                                name: item.name,
                                                                price: parsedPrice,
                                                                logoUrl: item.image ?? '',
                                                                description: item.description ?? '',
                                                            })
                                                        }
                                                        className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-sm font-semibold rounded-r"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}

            {/* Sticky footer */}
            <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg p-4">
                <button
                    disabled={total === 0}
                    onClick={() => setConfirmOpen(true)}
                    className="w-full py-3 bg-indigo-600 text-white rounded text-lg disabled:opacity-50"
                >
                    Buy {total > 0 && `(${total} kr)`}
                </button>
            </div>

            {confirmOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full space-y-4">
                        <h2 className="text-xl font-semibold">Confirm Purchase</h2>
                        <ul className="text-sm text-gray-700 space-y-1">
                            {Object.values(cart).map((item) => (
                                <li key={item.id}>
                                    {item.name} × {item.quantity} = {item.quantity * item.price} kr
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between items-center pt-3">
                            <button
                                onClick={() => clear()}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Clear Cart
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfirmOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:underline"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        console.log('Would POST:', cart);
                                        clear();
                                        setConfirmOpen(false);
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
