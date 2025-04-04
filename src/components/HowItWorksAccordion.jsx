
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from "react-accessible-accordion";

const HowItWorksAccordion = () => {
    const steps = [
        {
            title: "Register / Login To Our Platform",
            description: "Create an account or log in to start earning rewards. It only takes a few seconds!",
        },
        {
            title: "Enter Your Information Details",
            description: "Provide your details to personalize your experience and ensure smooth transactions.",
        },
        {
            title: "Perform a Task",
            description: "Complete simple tasks like sharing content, referring friends, or participating in surveys.",
        },
        {
            title: "Earn",
            description: "Accumulate points or rewards for every task you complete. The more you do, the more you earn!",
        },
        {
            title: "Withdraw",
            description: "Redeem your earnings as cash, gift cards, or other exciting rewards.",
        },
    ];

    return (
        <Accordion allowMultipleExpanded allowZeroExpanded className="rounded-lg border border-primary-300/80 overflow-hidden">
            {steps.map((step, index) => (
                <AccordionItem key={index} className="border-b border-primary-300/80 last:border-b-0">
                    <AccordionItemHeading>
                        <AccordionItemButton>
                            <div className="flex items-center justify-between w-full p-5 bg-primary-800/40 backdrop-blur-xl text-white">
                                <h4 className="font-medium text-primary-100">{step.title}</h4>
                                <div className="p-1 bg-primary-800/40 backdrop-blur-xl rounded-full">
                                    <svg className="w-5 h-5 text-primary-100 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <div className="p-5 bg-primary-200/90">
                            <p className="text-sm text-black">{step.description}</p>
                        </div>
                    </AccordionItemPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default HowItWorksAccordion;
