import React from "react";
import Button from "../Button/Button";


export default function About() {
    return (
        <div className="py-20 bg-gray-50" id="about">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left Images */}
                    <div className="grid grid-cols-2 gap-6 items-stretch">
                        {/* Column 1: Image + Quote */}
                        <div className="space-y-6 flex flex-col">
                            <img
                                src="https://picsum.photos/400/500?random=6"
                                alt="Child drinking"
                                className="rounded-2xl object-cover h-56 w-full shadow-lg"
                            />
                            <div className="bg-white p-6 shadow-xl rounded-2xl flex-1 flex flex-col justify-center">
                                <p className="text-gray-600 italic font-serif text-sm mb-4 leading-relaxed">"This peace is awesome and huge! Michael was super cool and very pleasant. If you want someone to deliver the record to your project."</p>
                                <div>
                                    <p className="font-bold text-primary-900">- Hague Merry</p>
                                    <p className="text-xs text-gray-400 mt-1">Volunteer</p>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Tall Image */}
                        <div className="h-full">
                            <img
                                src="https://picsum.photos/400/600?random=7"
                                alt="Child smiling"
                                className="rounded-2xl object-cover w-full h-full shadow-lg min-h-[300px]"
                            />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="space-y-8 pt-4">
                        <span className="text-xs font-bold tracking-widest text-primary-900 uppercase">Gift Of God</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 leading-tight">
                            Helping Others <br /> Improves World
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Ensure that kids living in poverty have access to life-changing benefits like medical care, educational support, life skills and job training before they graduate.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-primary-900">Save Water</span>
                                    <span className="text-gray-500">59%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-primary-900 h-2 rounded-full" style={{ width: '59%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-primary-900">Education</span>
                                    <span className="text-gray-500">86%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-primary-900 h-2 rounded-full" style={{ width: '86%' }}></div>
                                </div>
                            </div>
                        </div>

                        <Button variant="outline" className="!text-primary-900 !border-primary-900 hover:!bg-primary-900 hover:!text-white mt-4">
                            ABOUT US
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}