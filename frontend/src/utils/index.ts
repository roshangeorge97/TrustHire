import { isAxiosError } from 'axios'

function extractGitHubRepoPath(url: string) {
	const match = url.match(
		/^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
	)
	if (!match || !(match.groups?.owner && match.groups?.name)) return null
	return `${match.groups.owner}/${match.groups.name}`
}

const handleError = (error: unknown) => {
	if (isAxiosError(error) || error instanceof Error) {
		return error.message
	}
	return 'Something went wrong'
}

export { extractGitHubRepoPath, handleError }
