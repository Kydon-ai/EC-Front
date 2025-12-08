import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';
// 用于生成用户提问ID
const generate_uuid = () => {
	return uuidv4()
}
// 用于生成会话ID
const hexAlphabet = '0123456789abcdef'; // 共16个字符
const generate_32_md5 = () => {
	const generateMD5LikeId = customAlphabet(hexAlphabet, 32);
	const md5LikeId = generateMD5LikeId();
	console.log("生成md5:", md5LikeId); // 输出示例：'8f1a3c7e02d94b56a8f2e9b1c0a3d7f5'
	return md5LikeId
}

export { generate_uuid, generate_32_md5 }