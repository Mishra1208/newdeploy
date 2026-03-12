const XlsxPopulate = require('xlsx-populate');
const path = require('path');

const budgetItems = [
    { category: "Infrastructure (12 Months)", item: "Vercel Pro Hosting ($27/mo)", cost: 324.00, notes: "Frontend Hosting & Serverless Functions" },
    { category: "Infrastructure (12 Months)", item: "Supabase Database Pro ($33/mo)", cost: 396.00, notes: "Data Persistence, Auth & Backups" },
    { category: "Infrastructure (12 Months)", item: "Render Backend Service ($10/mo)", cost: 120.00, notes: "Express Server & RMP Scraper" },
    { category: "Infrastructure (12 Months)", item: "Domain (conuplanner.com) & Security", cost: 60.00, notes: "Renewal & SSL Certificates" },
    
    { category: "Marketing & Outreach", item: "Campus Posters & Flyers", cost: 250.00, notes: "High-quality prints for Library/EV/Hall" },
    { category: "Marketing & Outreach", item: "Social Media Ad Campaign", cost: 200.00, notes: "Targeted Instagram/Reddit ads for Concordia students" },
    
    { category: "Miscellaneous & Ops", item: "Development Tools & Licenses", cost: 100.00, notes: "Figma, GitHub Copilot, Chrome Web Store Fee" },
    { category: "Miscellaneous & Ops", item: "Contingency Fund (Buffer)", cost: 50.00, notes: "Unexpected overages (~3%)" }
];

const total = budgetItems.reduce((acc, curr) => acc + curr.cost, 0);

XlsxPopulate.fromBlankAsync()
    .then(workbook => {
        const sheet = workbook.sheet(0);
        
        // Title
        sheet.range("A1:D1").merged(true).value("ConU Planner - Special Project Grant Budget").style({
            bold: true,
            horizontalAlignment: "center",
            fontSize: 16,
            fill: "912338", // Concordia Maroon
            fontColor: "ffffff"
        });

        // Headers
        sheet.cell("A3").value("Category").style({ bold: true, fill: "E0E0E0" });
        sheet.cell("B3").value("Item Description").style({ bold: true, fill: "E0E0E0" });
        sheet.cell("C3").value("Cost (CAD)").style({ bold: true, fill: "E0E0E0" });
        sheet.cell("D3").value("Notes").style({ bold: true, fill: "E0E0E0" });

        // Data
        budgetItems.forEach((row, i) => {
            const r = i + 4;
            sheet.cell(`A${r}`).value(row.category);
            sheet.cell(`B${r}`).value(row.item);
            sheet.cell(`C${r}`).value(row.cost).style({ numberFormat: "$0.00" });
            sheet.cell(`D${r}`).value(row.notes);
        });

        // Total Row
        const totalRow = budgetItems.length + 5;
        sheet.cell(`B${totalRow}`).value("TOTAL REQUESTED").style({ bold: true, horizontalAlignment: "right" });
        sheet.cell(`C${totalRow}`).value(total).style({ bold: true, numberFormat: "$0.00", fill: "FFEE00" });

        // Column Widths
        sheet.column("A").width(30);
        sheet.column("B").width(40);
        sheet.column("C").width(15);
        sheet.column("D").width(50);

        // Usage Check
        console.log(`Generating Budget File... Total Amount: $${total}`);

        return workbook.toFileAsync("./ConU_Planner_Spcial_Project_Budget.xlsx");
    })
    .then(() => {
        console.log("✅ Budget Excel file created successfully: ConU_Planner_Spcial_Project_Budget.xlsx");
    })
    .catch(err => console.error(err));
