exports.handleSupportRequest = async (req, res) => {
    const { name, email, message } = req.body;

    // Here you can implement logic to save the message to a database or send an email
    console.log(`Support request from ${name} (${email}): ${message}`);

    // Respond with success
    return res.status(200).json({ success: true, message: 'Support request received!' });
};