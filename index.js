import express from "express"
import bodyParser from "body-parser"
import axios from "axios"
import 'dotenv/config'

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});


const config = {
	headers: { //This is very sensitive, I missed the s and it didn't work. I thought it was a variable like name.
		Authorization: process.env.OPENAI_API_KEY
	}
};

app.post("/idea", async (req, res) => {
	try {
		const keyword = req.body.keyword;

		const request = {
			model: "gpt-4o",
			messages: [{"role": "user", "content": 
				`Given the keyword '${keyword}', 
				think step-by-step to identify a practical, 
				realistic, and innovative business idea 
				in the related field. The idea must be 
				within the reach of the majority, 
				avoiding technologies or concepts that are 
				inaccessible or impractical for most people. 
				Output only the idea as a single, 
				unique sentence starting directly 
				with the core concept, avoiding verbs, 
				articles like 'a' or 'an', or any introductory phrases. 
				Ensure the idea has a feasible and sustainable business model. 
				Do not include explanations or additional context.`}],
		}

		const response = await axios.post('https://api.openai.com/v1/chat/completions', request, config);
		const result = JSON.stringify(response.data.choices[0].message.content);
		console.log(result);

		res.render("index.ejs", {
			content: result
		});

	} catch (error) {
		console.error(error.result);
	}
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

