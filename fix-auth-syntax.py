with open('components/AuthModal.tsx', 'r') as f:
    c = f.read()

bad_string = """  const [isCompany,
        acceptedTerms: true,
        acceptedTermsAt: Date.now(), setIsCompany] = useState(false);"""

good_string = """  const [isCompany, setIsCompany] = useState(false);"""

c = c.replace(bad_string, good_string)

with open('components/AuthModal.tsx', 'w') as f:
    f.write(c)
