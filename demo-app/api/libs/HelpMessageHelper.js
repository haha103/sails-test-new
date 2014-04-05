var message_types = [
	{ name: "投诉", name_en: "complaint" },
	{ name: "建议", name_en: "suggestion" },
	{ name: "疑问", name_en: "question" },
	{ name: "其他", name_en: "other" }
];

var message_types_zh_to_en = {
	"投诉": "complaint",
	"建议": "suggestion",
	"疑问": "question",
	"其他": "other"
};

var message_types_en_to_zh = {
	"complaint": "投诉",
	"suggestion": "建议",
	"question": "疑问",
	"other": "其他" 
};

var self = {
	types: function() {
		return message_types;
	},
	types_zh_en: message_types_zh_to_en,
	types_en_zh: message_types_en_to_zh,
};

module.exports = self;
