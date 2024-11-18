"use client";

import React, { useState } from 'react';

interface SupportRequest {
    customerName: string;
    email: string;
    telephone: string;
    module: string;
    priority: string;
    message: string;
    user: string;
    approver: string;
    status: string;
    sent: boolean;
    lastModifiedBy: string;
    lastModifiedDate: string;
    createdOn: string;
}

const initialRequests: SupportRequest[] = [
    {
        customerName: 'John Doe',
        email: 'john.doe@example.com',
        telephone: '1234567890',
        module: 'Billing',
        priority: 'High',
        message: 'Need help with my invoice.',
        user: 'Admin',
        approver: 'Manager',
        status: 'Open',
        sent: true,
        lastModifiedBy: 'Admin',
        lastModifiedDate: '2024-10-28',
        createdOn: '2024-10-20',
    },
    // Add more initial requests as needed
];

const SupportPage: React.FC = () => {
    const [requests, setRequests] = useState<SupportRequest[]>(initialRequests);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentRequest, setCurrentRequest] = useState<SupportRequest | null>(null);
    const [searchUser, setSearchUser] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredRequests, setFilteredRequests] = useState<SupportRequest[]>(initialRequests);

    const handleOpenModal = (request?: SupportRequest) => {
        setCurrentRequest(request || null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentRequest(null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newRequest: SupportRequest = {
            customerName: formData.get('customerName') as string,
            email: formData.get('email') as string,
            telephone: formData.get('telephone') as string,
            module: formData.get('module') as string,
            priority: formData.get('priority') as string,
            message: formData.get('message') as string,
            user: 'Admin', // Set user dynamically as needed
            approver: 'Manager', // Set approver dynamically as needed
            status: 'Open', // Default status
            sent: false, // Default sent status
            lastModifiedBy: 'Admin', // Set dynamically
            lastModifiedDate: new Date().toISOString().split('T')[0],
            createdOn: new Date().toISOString().split('T')[0],
        };

        if (currentRequest) {
            // Update existing request
            const updatedRequests = requests.map(req => req === currentRequest ? newRequest : req);
            setRequests(updatedRequests);
        } else {
            // Add new request
            setRequests([...requests, newRequest]);
        }

        handleCloseModal();
    };

    const handleSearch = () => {
        const filtered = requests.filter(request => {
            const matchesUser = searchUser ? request.customerName.toLowerCase().includes(searchUser.toLowerCase()) : true;
            const matchesDateRange =
                (!startDate || request.createdOn >= startDate) &&
                (!endDate || request.createdOn <= endDate);
            return matchesUser && matchesDateRange;
        });
        setFilteredRequests(filtered);
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 p-6 w-full">
            <div className="w-full bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Customer Support</h2>

                {/* Search Bar */}
                <div className="mt-24 mb-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <input
                            type="text"
                            placeholder="Search by Customer Name..."
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                        />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                        >
                            Search
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="mb-4 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                    Create New Request
                </button>

                <table className="min-w-full bg-white border border-gray-200 mt-6 rounded-lg overflow-hidden shadow-md mt-24">
                <thead className="bg-gradient-to-r from-gray-500 to-gray-700 text-white">
                <tr>
                            <th className="py-3 px-4 border-b">Customer Name</th>
                            <th className="py-3 px-4 border-b">Email</th>
                            <th className="py-3 px-4 border-b">Telephone</th>
                            <th className="py-3 px-4 border-b">Module</th>
                            <th className="py-3 px-4 border-b">Priority</th>
                            <th className="py-3 px-4 border-b">Message</th>
                            <th className="py-3 px-4 border-b">User</th>
                            <th className="py-3 px-4 border-b">Approver</th>
                            <th className="py-3 px-4 border-b">Status</th>
                            <th className="py-3 px-4 border-b">Sent?</th>
                            <th className="py-3 px-4 border-b">Last Modified By</th>
                            <th className="py-3 px-4 border-b">Last Modified Date</th>
                            <th className="py-3 px-4 border-b">Created On</th>
                            <th className="py-3 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map((request, index) => (
                            <tr key={index} className="hover:bg-gray-100 transition duration-150">
                                <td className="py-2 px-4 border-b">{request.customerName}</td>
                                <td className="py-2 px-4 border-b">{request.email}</td>
                                <td className="py-2 px-4 border-b">{request.telephone}</td>
                                <td className="py-2 px-4 border-b">{request.module}</td>
                                <td className="py-2 px-4 border-b">{request.priority}</td>
                                <td className="py-2 px-4 border-b">{request.message}</td>
                                <td className="py-2 px-4 border-b">{request.user}</td>
                                <td className="py-2 px-4 border-b">{request.approver}</td>
                                <td className="py-2 px-4 border-b">{request.status}</td>
                                <td className="py-2 px-4 border-b">{request.sent ? 'Yes' : 'No'}</td>
                                <td className="py-2 px-4 border-b">{request.lastModifiedBy}</td>
                                <td className="py-2 px-4 border-b">{request.lastModifiedDate}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleOpenModal(request)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{currentRequest ? 'Edit Request' : 'Create Request'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Customer Name</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    defaultValue={currentRequest?.customerName || ''}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={currentRequest?.email || ''}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Telephone</label>
                                <input
                                    type="tel"
                                    name="telephone"
                                    defaultValue={currentRequest?.telephone || ''}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Module</label>
                                <input
                                    type="text"
                                    name="module"
                                    defaultValue={currentRequest?.module || ''}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Priority</label>
                                <input
                                    type="text"
                                    name="priority"
                                    defaultValue={currentRequest?.priority || ''}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Message</label>
                                <textarea
                                    name="message"
                                    defaultValue={currentRequest?.message || ''}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="mr-4 bg-gray-300 text-black font-bold py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                                >
                                    {currentRequest ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportPage;
