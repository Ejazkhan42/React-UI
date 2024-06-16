const fs = require('fs');
const FormData = require('form-data');
const Jenkins=require("jenkins");

async function test() {
    const jenkins = new Jenkins({
        baseUrl: 'https://Ejaz.Ahmed:D01ngERP!01@jenkins.doingerp.com:443',
        crumbIssuer: true,
        formData: FormData // Pass FormData module for handling form data
    });

    const jobName = 'Test'; // Replace with your Jenkins job name

    const parameters = {
        FILE: fs.createReadStream('test.xlsx'),
        // Add other parameters as needed
        // TestCase: testCase || '',
        // GridMode: gridMode || '',
        // Browsers: browsers || '',
        // ProfilePath: ProfilePath || '',
    };
    console.log(parameters.FILE)
    try {
        // Trigger the Jenkins job build
        const info = await jenkins.job.build({
            name: jobName,
            parameters: parameters
        });

        console.log('Build triggered successfully:', info);
    } catch (error) {
        console.error('Error triggering build:', error);
    }
}

test()


