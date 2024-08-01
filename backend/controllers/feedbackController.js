exports.handleFeedback = async (req, res) => {
    const { name, email, rating, message } = req.body;

    // Here you can implement logic to save the feedback to a database or send an email
    console.log(`Feedback from ${name} (${email}): Rating: ${rating}, Message: ${message}`);

    // Respond with success
    return res.status(200).json({ success: true, message: 'Feedback received!' });
};