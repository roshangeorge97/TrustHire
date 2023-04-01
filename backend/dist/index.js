"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const reclaim_sdk_1 = require("@reclaimprotocol/reclaim-sdk");
const pg_1 = require("pg");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
const callbackUrl = process.env.CALLBACK_URL + '/' + 'callback/';
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const reclaim = new reclaim_sdk_1.Reclaim(callbackUrl);
const isValidRepo = (repoStr) => {
    return repoStr.indexOf('/') > -1 && repoStr.split('/').length === 2;
};
app.get('/', (req, res) => {
    res.send('works!');
});
app.get('/home/repo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { repo, email } = req.query;
    if (!repo || !email) {
        res.status(400).send(`400 - Bad Request: repo and email are required`);
        return;
    }
    const repoFullName = repo;
    const emailStr = email;
    if (!isValidRepo(repoFullName)) {
        res.status(400).send(`400 - Bad Request: invalid repository name`);
        return;
    }
    const callbackId = 'repo-' + (0, reclaim_sdk_1.generateUuid)();
    const template = (yield reclaim.getConsent('Github-contributor', [
        {
            provider: 'github-contributor',
            params: {
                repo: repoFullName,
            },
        },
    ])).generateTemplate(callbackId);
    const url = template.url;
    const templateId = template.id;
    try {
        yield pool.query('INSERT INTO submitted_links (callback_id, status, repo, email, template_id) VALUES ($1, $2, $3, $4, $5)', [callbackId, 'pending', repoFullName, emailStr, templateId]);
    }
    catch (e) {
        res.status(400).send(`500 - Internal Server Error - ${e}`);
        return;
    }
    res.json({ url, callbackId });
}));
app.get('/status/:callbackId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let statuses;
    if (!req.params.callbackId) {
        res.status(400).send(`400 - Bad Request: callbackId is required`);
        return;
    }
    const callbackId = req.params.callbackId;
    try {
        const results = yield pool.query('SELECT callback_id FROM submitted_links WHERE callback_id = $1', [callbackId]);
        if (results.rows.length === 0) {
            res.status(404).send(`404 - Not Found: callbackId not found`);
            return;
        }
    }
    catch (e) {
        res.status(500).send(`500 - Internal Server Error - ${e}`);
        return;
    }
    try {
        statuses = yield pool.query('SELECT status FROM submitted_links WHERE callback_id = $1', [callbackId]);
    }
    catch (e) {
        res.status(500).send(`500 - Internal Server Error - ${e}`);
        return;
    }
    res.json({ status: (_a = statuses === null || statuses === void 0 ? void 0 : statuses.rows[0]) === null || _a === void 0 ? void 0 : _a.status });
}));
app.use(express_1.default.text());
app.post('/callback/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        res.status(400).send(`400 - Bad Request: callbackId is required`);
        return;
    }
    if (!req.body) {
        res.status(400).send(`400 - Bad Request: body is required`);
        return;
    }
    const reqBody = JSON.parse(decodeURIComponent(req.body));
    if (!reqBody.claims || !reqBody.claims.length) {
        res.status(400).send(`400 - Bad Request: claims are required`);
        return;
    }
    const callbackId = req.params.id;
    const claims = { claims: reqBody.claims };
    try {
        const results = yield pool.query('SELECT * FROM submitted_links WHERE callback_id = $1', [callbackId]);
        if (results.rows.length === 0) {
            res.status(404).send(`404 - Not Found: callbackId not found`);
            return;
        }
    }
    catch (e) {
        res.status(500).send(`500 - Internal Server Error - ${e}`);
        return;
    }
    try {
        yield pool.query('UPDATE submitted_links SET claims = $1, status = $2 WHERE callback_id = $3;', [JSON.stringify(claims), 'verified', callbackId]);
    }
    catch (e) {
        res.status(500).send(`500 - Internal Server Error - ${e}`);
        return;
    }
    res.send(`<h3>Success!</h3>`);
}));
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
