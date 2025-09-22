"use client";

import { useEffect, useState } from "react";
import api from "./api";
import toast from "react-hot-toast";
import {
	ActivityIcon,
	ArrowDownCircle,
	ArrowUpCircle,
	PlusCircle,
	Trash,
	TrendingDown,
	TrendingUp,
	Wallet,
} from "lucide-react";

type transactionType = {
	id: string;
	text: string;
	amount: number;
	created_at: string;
};

export default function Home() {
	const [transactions, setTransactions] = useState<transactionType[]>([]);
	const [text, setText] = useState<string>("");
	const [amount, setAmount] = useState<number | "">("");
	const [loading, setLoading] = useState(false);

	const getTransactions = async () => {
		try {
			const res = await api.get<transactionType[]>("transactions/");
			setTransactions(res.data);
			toast.success("Successfully");
		} catch (err) {
			console.error("failde to fetch", err);
			toast.error("Failed");
		}
	};

	const deleteTransaction = async (id: string) => {
		try {
			await api.delete(`transactions/${id}/`);
			getTransactions();
			toast.success("Transaction successfully deleted");
		} catch (error) {
			console.error("Error deleting transaction", error);
			toast.error("Error deleting transaction");
		}
	};

	const addTransaction = async () => {
		if (!text || amount == "" || isNaN(Number(amount))) {
			toast.error("Please enter valid text and amount");
			return;
		}
		setLoading(true);

		try {
			const res = await api.post<transactionType>(`transactions/`, {
				text,
				amount: Number(amount),
			});
			getTransactions();
			const modal = document.getElementById(
				"my_modal_3"
			) as HTMLDialogElement;
			if (modal) {
				modal.close();
			}

			toast.success("Transaction successfully added.");
			setText("");
			setAmount("");
		} catch (error) {
			console.error("Error adding transaction", error);
			toast.error("Error adding transaction");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getTransactions();
	}, []);

	const amounts = transactions.map((t) => Number(t.amount) || 0);
	const balance = amounts.reduce((acc, item) => acc + item, 0) || 0;
	const income =
		amounts.filter((a) => a > 0).reduce((acc, item) => acc + item, 0) || 0;
	const expense =
		amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0) || 0;

	const ratio =
		income > 0 ? Math.min((Math.abs(expense) / income) * 100, 100) : 0;

	const formatDate = (dateString: string) => {
		const d = new Date(dateString);
		return d.toLocaleDateString("en-EN", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="w-2/3 flex flex-col gap-4 ">
			<div className="flex justify-between rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5 ">
				<div className=" flex flex-col gap-1 ">
					<div className=" badge badge-soft">
						<Wallet className="w-4 h4" />
						Your balance
					</div>
					<div className=" stat-value "> {balance.toFixed(2)} $ </div>
				</div>

				<div className="flex flex-col gap-1">
					<div className=" badge badge-soft badge-success">
						<ArrowUpCircle className="w-4 h4" />
						Your Income
					</div>
					<div className="stat-value">{income.toFixed(2)} €</div>
				</div>

				<div className="flex flex-col gap-1 ">
					<div className=" badge badge-soft badge-error">
						<ArrowDownCircle className="w-4 h4" />
						Your Expenses
					</div>
					<div className="stat-value">{expense.toFixed(2)} €</div>
				</div>
			</div>

			<div className="rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">
				<div className="flex justify-between items-center mb-1 ">
					<div className="flex items-center badge-soft badge-warning gap-1 ">
						<ActivityIcon className="w-4 h-4" />
						Expenses vs Income
					</div>
					<div> {ratio.toFixed(0)} %</div>
				</div>

				<progress
					className="progress progress-warning w-full"
					value={ratio}
					max={100}
				></progress>
			</div>

			<button
				className="btn btn-warning"
				onClick={() =>
					(
						document.getElementById(
							"my_modal_3"
						) as HTMLDialogElement
					).showModal()
				}
			>
				<PlusCircle className="w-4 h-4" />
				Add a transaction
			</button>

			<div className="overflow-x-auto rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 ">
				<table className="table">
					{/* head */}
					<thead>
						<tr>
							<th>#</th>
							<th>Description</th>
							<th>Amount</th>
							<th>Date</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((t, index) => (
							<tr key={t.id}>
								<th>{index + 1}</th>
								<td>{t.text}</td>
								<td className=" font-semibold flex items-center gap-2">
									{t.amount > 0 ? (
										<TrendingUp className="text-success w-6 h-6" />
									) : (
										<TrendingDown className="text-error w-6 h-6" />
									)}
									{t.amount > 0
										? `+${t.amount}`
										: `${t.amount}`}
								</td>
								<td>{formatDate(t.created_at)}</td>
								<td>
									<button
										onClick={() => deleteTransaction(t.id)}
										className="btn btn-sm btn-error btn-soft"
										title="Delete"
									>
										<Trash className=" w-4 h-4" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<dialog id="my_modal_3" className="modal backdrop-blur">
				<div className="modal-box border-2 border-warning/10 border-dashed">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">Add a transaction</h3>
					<div className="flex flex-col gap-4 mt-4">
						<div className="flex flex-col gap-2">
							<label className="label">Texte</label>
							<input
								type="text"
								name="text"
								value={text}
								onChange={(e) => setText(e.target.value)}
								placeholder="Entrez le texte..."
								className="input w-full"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label className="label">
								Amount (négatif - expense, positif - income)
							</label>
							<input
								type="number"
								name="amount"
								value={amount}
								onChange={(e) =>
									setAmount(
										e.target.value === ""
											? ""
											: Number(e.target.value)
									)
								}
								placeholder="Enter the amount..."
								className="input w-full"
							/>
						</div>
						<button
							className="w-full btn btn-warning"
							onClick={addTransaction}
							disabled={loading}
						>
							<PlusCircle className="w-4 h-4" />
							Add
						</button>
					</div>
				</div>
			</dialog>
		</div>
	);
}
