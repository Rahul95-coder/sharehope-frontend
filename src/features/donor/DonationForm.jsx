import { useState } from "react"
import { useCreateDonation } from "./hooks"
import { Loader } from "lucide-react";


const DonationForm = () => {
    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        qty: 0,
        unit: "",
        foodType: "VEG",
        expiryDateTime: ""
    })

    const createDonationMutation = useCreateDonation();

    const handleSubmit = (e) => {
        e.preventDefault();
        // validation form state
        createDonationMutation.mutate(form)
    }

    return (
        <div>Donation Form

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" 
                    id="title"
                        value={form.title}
                        onChange={(e) => {
                            setForm((prev) => ({
                                ...prev,
                                title:e.target.value
                            }))
                        }}
                    />
                </div>
                 <div>
                    <label htmlFor="category">Category</label>
                    <input type="text" 
                    id="category"
                        value={form.category}
                        onChange={(e) => {
                            setForm((prev) => ({
                                ...prev,
                                category:e.target.value
                            }))
                        }}
                    />
                </div>
                 <div>
                    <label htmlFor="description">Description</label>
                    <textarea 
                    id="description"
                        value={form.description}
                        onChange={(e) => {
                            setForm((prev) => ({
                                ...prev,
                                description:e.target.value
                            }))
                        }}
                    />
                </div>
                 <div>
                    <label htmlFor="qty">Qty</label>
                    <input type="number" 
                    id="qty"
                        value={form.qty}
                        onChange={(e) => {
                            setForm((prev) => ({
                                ...prev,
                                qty:e.target.value
                            }))
                        }}
                    />
                </div>
                 <div>
                    <label htmlFor="unit">Unit</label>
                    <input type="text" 
                    id="unit"
                        value={form.unit}
                        onChange={(e) => {
                            setForm((prev) => ({
                                ...prev,
                                unit:e.target.value
                            }))
                        }}
                    />
                </div>
                 <div>
                    <label htmlFor="foodType">Food type</label>
                    <select 
                    id="foodType"
                        value={form.foodType}
                        onChange={(e) => {
                            setForm((prev) => ({
                                ...prev,
                                foodType:e.target.value
                            }))
                        }}
                    >
                        <option value={"VEG"}> Veg</option>
                        <option value={"NONVEG"}> Non Veg</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="expiryDateTime">Expiry date time</label>
                    <input 
                    type="datetime-local"
                    id="expiryDateTime"
                        value={form.expiryDateTime}
                        onChange={(e) => {
                            setForm((prev) => ({
                                ...prev,
                                expiryDateTime:e.target.value
                            }))
                        }}
                    />
                </div>

                <div>
                    <button type="submit"
                    disabled={createDonationMutation.isPending}
                    >

                        {
createDonationMutation.isPending ? <Loader className="animate-spin"/>
                            : "Create"
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default DonationForm