with open('app/page.tsx', 'r') as f:
    c = f.read()

bad_logic = 'onClick={() => setReclamarModal({ title: gift.title, image: gift.images[0] })}'
good_logic = '''onClick={() => {
                  const userId = localStorage.getItem("ayudarte_user_id");
                  if (!userId) {
                    setIsAuthOpen(true);
                  } else {
                    setIntentionItem({ id: gift.id, title: gift.title });
                  }
                }}'''

c = c.replace(bad_logic, good_logic)

with open('app/page.tsx', 'w') as f:
    f.write(c)
